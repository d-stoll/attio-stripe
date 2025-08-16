# Stripe

Stripe app for Attio, built with the [App SDK](https://docs.attio.com/sdk/introduction).

## Overview

Sync resources from Stripe to Attio custom objects in realtime. Connect your Stripe account in one click and the app will automatically create custom objects in Attio and capture any changes in Stripe in your workspace.

## Features

The app will create syned objects for the following resources:

* Customers: All of your Stripe customers will be synced into a `Customers` object in Attio. Key information such as name and email address will be brought over, and all of their properties will be mapped to attributes.
* Invoices: All of your Stripe invoices will be synced into a `Invoices` object in Attio. Each invoice will be linked to its corresponding customer.
* Subscription: All of your Stripe subscriptions will be synced into a `Subscriptions` object in Attio. Each subscription will be linked to its corresponding customer.

## Requirements

You need at least 3 available custom objects in your workspace. Practically this means you need at least the Plus plan, if you disable Users, Organizations, and Deals.

We recommend Pro or Enterprise since both plans have enough objects to not interfere with the rest of your CRM.


