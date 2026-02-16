#!/bin/bash

echo "🔎 Integration Test Starting..."

# Verify AWS CLI
aws --version || { echo "❌ AWS CLI not installed"; exit 1; }

# Fetch EC2 Public DNS using tag (adjust tag if needed)
URL=$(aws ec2 describe-instances \
  --query "Reservations[].Instances[?Tags[?Value=='dev-deploy']].PublicDnsName" \
  --output text)

echo "🌐 EC2 URL: $URL"

if [[ -z "$URL" ]]; then
    echo "❌ Could not fetch EC2 Public DNS. Check instance tag or AWS permissions."
    exit 1
fi

# ==============================
# 1️⃣ Health Check
# ==============================

echo "🔍 Checking health endpoint..."

http_code=$(curl -s -o /dev/null -w "%{http_code}" http://$URL:3000/health)
echo "HTTP Status Code: $http_code"

# ==============================
# 2️⃣ Species Data Check
# ==============================

echo "🔍 Fetching species data..."

species_data=$(curl -s http://$URL:3000/species)

if [[ -z "$species_data" ]]; then
    echo "❌ No response from /species endpoint"
    exit 1
fi

echo "Species Response: $species_data"

# Extract first species name
first_species=$(echo "$species_data" | jq -r '.[0].name')

echo "First Species Name: $first_species"

# ==============================
# Validation
# ==============================

if [[ "$http_code" -eq 200 && "$first_species" == "Giant Squid" ]]; then
    echo "✅ Integration Tests Passed"
else
    echo "❌ One or more integration tests failed"
    exit 1
fi
