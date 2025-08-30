# Viktoria Wertheim Project Overview

## Project Purpose
This is a Next.js web application for Viktoria Wertheim, which appears to be a sports club/team website. The application includes:
- Team information pages
- News section with carousel and modal functionality
- Shop/merchandise page
- Contact page
- League tables and top scorers display
- Sponsor showcase
- Dark mode support

## Key Features
- Server-side rendering with Next.js 15.5.2 and React 19
- Supabase integration for backend services
- Responsive design with Tailwind CSS
- Dark/light theme switching
- Animated sections using Framer Motion
- News ticker and carousel components
- League standings and player statistics

## Project Structure
```
viktoria-wertheim/
├── src/
│   ├── app/           # Next.js app router pages
│   │   ├── kontakt/   # Contact page
│   │   ├── news/      # News page
│   │   ├── shop/      # Shop page
│   │   └── teams/     # Teams page
│   ├── components/    # React components
│   ├── lib/          # Utility functions
│   └── utils/        # Supabase utilities
├── supabase/         # Supabase configuration
├── public/           # Static assets
└── Docker files      # Containerization
```

## Deployment
- Dockerized application with Dockerfile
- Supabase backend for data management
- Can be deployed on Vercel or self-hosted