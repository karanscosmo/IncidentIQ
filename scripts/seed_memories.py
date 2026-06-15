import os
import time
from dotenv import load_dotenv
import certifi

# Fix SSL Verification for Hindsight Client
os.environ['SSL_CERT_FILE'] = certifi.where()

from app.services.hindsight_service import store_incident

load_dotenv()

INCIDENTS = [
    # 1. Redis Saturation
    """
    Incident: INC-882
    Title: Redis OOM killed by kernel
    Service: auth-service, promotion-engine
    Tags: Redis, MemoryLeak, OOM
    Root Cause: Unbounded cache growth in the Promotion Engine caused Redis memory to saturate (98.4%), leading to aggressive eviction and eventual OOM kill by the OS.
    Resolution: Applied maxmemory-policy allkeys-lru, increased instance size to r6g.xlarge, and implemented a TTL of 24h for all promotion tokens.
    Impact: 15 minutes of high latency for login and checkout.
    """,
    # 2. Connection Pool Exhaustion
    """
    Incident: INC-102
    Title: DB Connection pool exhaustion during auth service deploy
    Service: auth-service, database
    Tags: PostgreSQL, ConnectionPool
    Root Cause: A rolling update to auth-service did not close existing idle connections gracefully, causing the PostgreSQL max_connections limit (100) to be reached.
    Resolution: Increased DB max_connections to 200. Updated deployment script to gracefully drain connections and implemented PgBouncer for connection pooling.
    Impact: 5% error rate during deployment.
    """,
    # 3. Memory Leak
    """
    Incident: INC-405
    Title: Memory leak in token validation middleware
    Service: api-gateway
    Tags: MemoryLeak, NodeJS
    Root Cause: The JWT validation library was caching public keys indefinitely in an array instead of a Map with TTL, causing a gradual memory leak over 4 days.
    Resolution: Upgraded jsonwebtoken library and implemented a periodic cache clearing mechanism.
    Impact: Container restarts every 4 hours due to OOM.
    """,
    # 4. DB Deadlock
    """
    Incident: INC-1035
    Title: Database Deadlock in orders_v3
    Service: payment-service, database
    Tags: PostgreSQL, HighLoad, Deadlock
    Root Cause: Concurrent inserts into the orders_v3 table and updates to inventory caused a lock contention during peak load.
    Resolution: Scaled connection pool from 50 to 100, manually killed blocking transaction XID 8829, and optimized query ordering to prevent deadlocks.
    Impact: 450ms P99 latency increase in Payment API.
    """,
    # 5. CrashLoopBackOff
    """
    Incident: INC-910
    Title: Kubernetes CrashLoopBackOff on API Gateway
    Service: api-gateway
    Tags: Kubernetes, CrashLoopBackOff, ConfigMap
    Root Cause: A missing environment variable in the newly deployed ConfigMap caused the gateway process to crash immediately on startup.
    Resolution: Rolled back the ConfigMap deployment, added schema validation in CI/CD pipeline for all Helm charts.
    Impact: Deployment failed but caught by readiness probe. No customer impact.
    """,
    # 6. DNS Failure
    """
    Incident: INC-1102
    Title: CoreDNS resolution timeout during cluster scale-up
    Service: coredns, kubernetes
    Tags: DNS, Timeout, Kubernetes
    Root Cause: Sudden node scale-up caused CoreDNS pods to be scheduled on nodes with bad network routing tables, leading to intermittent NXDOMAIN responses.
    Resolution: Restarted CoreDNS deployment with anti-affinity rules, fixed VPC routing configuration on node startup script.
    Impact: 3 minutes of failed internal service-to-service communication.
    """,
    # 7. Certificate Expiration
    """
    Incident: INC-543
    Title: Expired wildcard TLS certificate on edge router
    Service: ingress-nginx
    Tags: TLS, Certificate, Outage
    Root Cause: Cert-manager failed to automatically renew the Let's Encrypt wildcard certificate due to a stale ACME DNS-01 webhook configuration.
    Resolution: Manually triggered cert-manager renewal, fixed webhook permissions, and added Datadog alert for certs expiring within 7 days.
    Impact: 45 minutes of total external API outage (SSL Error).
    """,
    # 8. S3 Bucket Permissions
    """
    Incident: INC-677
    Title: S3 Bucket Access Denied for media upload
    Service: media-service
    Tags: AWS, IAM, S3
    Root Cause: An overly restrictive IAM policy was deployed via Terraform that accidentally removed s3:PutObject permissions for the media-service role.
    Resolution: Reverted Terraform commit. Implemented IAM Access Analyzer checks in CI pipeline.
    Impact: Users unable to upload profile pictures for 2 hours.
    """,
    # 9. Kafka Consumer Lag
    """
    Incident: INC-890
    Title: Massive consumer lag on notification topic
    Service: notification-worker
    Tags: Kafka, Lag, Performance
    Root Cause: A malformed payload caused the notification worker to throw an uncaught exception, leading to a constant retry loop without committing the offset.
    Resolution: Added a dead-letter queue (DLQ) for malformed messages, fixed payload validation logic, and manually advanced consumer group offset.
    Impact: 3 hours of delayed push notifications.
    """,
    # 10. External API Rate Limit
    """
    Incident: INC-332
    Title: Stripe API Rate Limit Exceeded
    Service: billing-service
    Tags: ThirdParty, RateLimit, Stripe
    Root Cause: A runaway cron job attempted to process 10,000 pending invoices concurrently instead of batching them, triggering Stripe's rate limits.
    Resolution: Implemented an exponential backoff retry mechanism and throttled the cron job to process 50 invoices per second.
    Impact: 20% of subscription renewals failed and required manual retry.
    """,
    # 11. CPU Throttling
    """
    Incident: INC-771
    Title: Heavy CPU throttling on search-indexer
    Service: search-service
    Tags: Kubernetes, CPU, Performance
    Root Cause: The search-indexer pod was assigned CPU limits of 500m, but a new full-text extraction feature required sustained 1200m usage.
    Resolution: Removed CPU limits (kept requests at 1000m) to allow bursting, and optimized the extraction algorithm to use batch processing.
    Impact: Search indexing was delayed by up to 2 hours.
    """,
    # 12. Disk Space Exhaustion
    """
    Incident: INC-901
    Title: Node DiskPressure due to container logs
    Service: kubernetes-node
    Tags: Disk, Logging, Outage
    Root Cause: Fluentbit daemonset crashed, causing container logs to pile up on the node disk until it hit 100% capacity, triggering pod evictions.
    Resolution: Configured docker daemon log-rotation (max-size=100m, max-file=3), restarted fluentbit, and cleared orphaned log files.
    Impact: 3 microservices evicted and rescheduled, causing 2 minutes of instability.
    """,
    # 13. ElasticSearch Split Brain
    """
    Incident: INC-1120
    Title: Elasticsearch cluster split brain
    Service: elasticsearch
    Tags: Elasticsearch, SplitBrain, Network
    Root Cause: A network partition between two availability zones caused the ES cluster to elect two master nodes simultaneously.
    Resolution: Enforced discovery.zen.minimum_master_nodes=2, restarted the isolated nodes to rejoin the primary cluster, and re-indexed lost documents.
    Impact: Search API returned inconsistent results for 15 minutes.
    """,
    # 14. N+1 Query Problem
    """
    Incident: INC-455
    Title: Severe latency spike on User Dashboard
    Service: user-service
    Tags: Performance, Database, ORM
    Root Cause: A new "recent activity" component introduced an N+1 query issue in the ORM, causing 50+ sequential DB queries per page load.
    Resolution: Refactored the ORM query to use eager loading (JOINs) and cached the activity feed in Redis.
    Impact: Dashboard load time increased from 200ms to 8 seconds.
    """,
    # 15. Redis Eviction Storm
    """
    Incident: INC-889
    Title: Redis Eviction Storm
    Service: cache-cluster
    Tags: Redis, Performance
    Root Cause: A marketing push resulted in a flood of new cache keys without TTLs. Redis hit the memory limit and spent 90% of CPU evicting keys, causing a stall.
    Resolution: Scaled Redis cluster from 3 to 5 shards, forced a global 7-day TTL on all keys, and optimized the eviction policy.
    Impact: 5 minutes of total cache unavailability, falling back to DB.
    """,
    # 16. RabbitMQ Queue Backup
    """
    Incident: INC-231
    Title: RabbitMQ memory alarm triggered
    Service: message-broker
    Tags: RabbitMQ, Queue
    Root Cause: The email-sender service crashed, leaving messages to pile up in RabbitMQ until the memory alarm blocked all publishers.
    Resolution: Restarted email-sender pods with higher memory limits, purged expired messages from the queue, and added a DLQ.
    Impact: No emails sent for 45 minutes; upstream APIs blocked for 5 minutes.
    """,
    # 17. Outdated Secrets
    """
    Incident: INC-511
    Title: Auth0 Client Secret expired
    Service: auth-service
    Tags: Security, Secrets, Outage
    Root Cause: The Auth0 Machine-to-Machine client secret was hardcoded to expire after 1 year, and no rotation process was in place.
    Resolution: Generated a new secret, injected it via AWS Secrets Manager, and set up an automated lambda to rotate keys every 90 days.
    Impact: Internal services could not authenticate for 30 minutes.
    """,
    # 18. Zombie Processes
    """
    Incident: INC-602
    Title: Zombie processes consuming PID space
    Service: video-transcoder
    Tags: Linux, PID, Zombie
    Root Cause: The transcoder application spawned FFmpeg sub-processes but failed to reap them (waitpid) when they crashed.
    Resolution: Updated the container to use an init process (tini) as PID 1 to properly reap zombie processes.
    Impact: Nodes stopped accepting new pods due to PID exhaustion.
    """,
    # 19. Misconfigured CDN
    """
    Incident: INC-788
    Title: CDN caching sensitive user data
    Service: frontend, cloudflare
    Tags: CDN, Security, Cache
    Root Cause: A missing Cache-Control header on the /api/user/profile endpoint caused Cloudflare to cache and serve identical profiles to different users.
    Resolution: Immediately purged CDN cache, added Cache-Control: no-store to all /api/ endpoints, and wrote a regression test.
    Impact: Serious privacy leak for 15 minutes.
    """,
    # 20. NTP Sync Failure
    """
    Incident: INC-990
    Title: OTP validation failing due to time drift
    Service: auth-service
    Tags: NTP, Time, Auth
    Root Cause: The chronyd NTP daemon silently failed on the auth-service nodes, causing a 45-second time drift. TOTP tokens failed validation.
    Resolution: Restarted chronyd, forced a time sync, and added an alert for time drift > 5 seconds.
    Impact: 15% of users unable to log in with 2FA for 1 hour.
    """
]

def seed():
    print("Starting Hindsight Memory Seeding with 20 incidents...")
    for incident in INCIDENTS:
        print(f"Storing incident: {incident.strip().splitlines()[0]}")
        try:
            store_incident(incident.strip())
            print("Successfully stored.")
        except Exception as e:
            print(f"Failed to store: {e}")
        time.sleep(1) # Rate limiting prevention
    print("Seeding complete.")

if __name__ == "__main__":
    seed()
