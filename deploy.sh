#!/bin/bash
# Azure App Service deployment script for Next.js

echo "Installing dependencies..."
npm install --production=false

echo "Building Next.js app..."
npm run build

echo "Build complete."
