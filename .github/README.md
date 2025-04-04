# sssync inventory management/cross-platform sync MVP

## Overview

This project is a web app that allows you to manage your inventory and sync it across multiple platforms.

First commit was on 2025-04-01

## Tech Stack

- JavaScript
- TypeScript
- Gadget.Dev
- Next.js
- Tailwind CSS
- Shadcn UI

Eventually move to .NET & Railway 


# Non-embedded Shopify app with OAuth

This app template allows developers to build a non-embedded Shopify app using Gadget's built-in Shopify authentication system. It simplifies managing user access to multiple shops and handling Shopify connections.

[![Fork template](https://img.shields.io/badge/Fork%20template-%233A0CFF?style=for-the-badge)](https://app.gadget.dev/auth/fork?domain=standalone-shopify-template.gadget.app)

## Key Features

- Models

  - `shopPermission`: A model that links user and shop records using a `hasManyThrough` relationship. It manages tenancy by determining which shops a user can access.

- Global Actions

  - `verifyConnections`: Verifies the current session to check if a new `shopPermission` record needs to be created, ensuring that user-shop relationships are properly managed.
