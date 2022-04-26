Reconocimiento del medio

# How to deploy on GCP cluster
- Get a regional IP address
- Create a GKE cluster
- Download credentials for GKE cluster (limited permissions)
- Setup DNS
- Setup Github secrets: GKE_EMAIL, GKE_KEY, GKE_PROJECT
- Change IP in deploy/ingress/nginx-ingress.yaml loadBalancerIP, or any IP you added in config files
- Update development and production configurations
- (Optional, for development env) Setup test database
- Create certificates and ingress and apply files (or use CI/CD with Github Actions)
