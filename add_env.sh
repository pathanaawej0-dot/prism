#!/bin/bash

# Function to add env var
add_env() {
  local name=$1
  local value=$2
  echo "Adding $name..."
  printf "%s" "$value" | vercel env add "$name" production
}

add_env "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY" "pk_test_c21hcnQtcG9ueS00My5jbGVyay5hY2NvdW50cy5kZXYk"
add_env "CLERK_SECRET_KEY" "sk_test_yDfFfS5UayqRQLUMVRVhiVjk8gNMnBHVIWMowjwaJ5"
add_env "NEXT_PUBLIC_CLERK_SIGN_IN_URL" "/sign-in"
add_env "NEXT_PUBLIC_CLERK_SIGN_UP_URL" "/sign-up"
add_env "NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL" "/"
add_env "NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL" "/"
add_env "DATABASE_URL" "postgresql://neondb_owner:npg_SONCYJat34yl@ep-weathered-haze-a4vqrpcu-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require"
add_env "GOOGLE_GENERATIVE_AI_API_KEY" "AIzaSyAhgil36iK6FrmCqHj3sBk91qHgI4vDIYQ"
add_env "RAZORPAY_KEY_ID" "rzp_test_RYvAEv2X8ymGqo"
add_env "RAZORPAY_KEY_SECRET" "ea6I8mX1773ARQa0Z1NBQMZu"
add_env "NEXT_PUBLIC_RAZORPAY_KEY_ID" "rzp_test_RYvAEv2X8ymGqo"
add_env "NEXT_PUBLIC_APP_URL" "https://prism-mauve-phi.vercel.app"

echo "All environment variables added."
