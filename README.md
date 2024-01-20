
## Demo

Here is the demo of the Wolfbyte AI running




https://github.com/quyenkhanhnghi/wolfbyte/assets/108847306/3ce9a734-a532-4680-9eaf-be8f159b2ac4




[Link to Wolfbyte AI PLATFORM](https://wolfbyte.vercel.app/)

#  Wolfbyte - AI Platform Generation

Welcome to Wolfbyte, an innovative AI platform designed using the latest web technologies, including Next.js 14, Tailwind CSS, Prisma, Shadcn/ui and Stripe. Wolfbyte latform offers a seamless and efficient experience for generating and managing AI-driven content and services. 
"Wolfbyte" combines the name of my cat, Wolf, and 'byte,' a digital term, signifying a personal touch with a nod to technology

###  Features
- AI-Powered Solutions: Leveraging state-of-the-art AI algorithms for content generation and analysis (OpenAI and Replicate AI) for conversation, code, image, music and video generation
- Modern Web Technologies: Built with Next.js 14 and Tailwind CSS for a responsive and intuitive user interface.
    - RESTful API Integration in api folder 
    - Server-Side Data Fetching
    - Layout Reusability
- Database Integration: Utilizing Prisma for robust and scalable database management.
- Enhanced UI Isolation: Implementing Shadc/ui to encapsulate our styles and markup for web components.
- Advanced Authentication and User Handling: Clerk Authentication, React-Hook-Form Validation and React-Toast for Error Handling
- User Experience: 
    - Page Loading State: Optimizing page load times for better user engagement.
    - Stripe Monthly Subscription: Incorporating Stripe for secure and flexible subscription payments (In Premium Account can adjust the billing plan and In FreeTrail Account can pay checkout the plan)
    - Free Tier with API Limiting: 5 times for FreeTrial AI Generation
    - CAT-themed Prompt Suggestion: Having Intuitive Prompt Suggestions in Home page to access the related route immediatly, and for sure, it is related to cat
- Advanced Chatbox Crips: Integrating an Chatbox Crips feature, designed to answer FAQs, or provide personalized assistance.


### Prerequisites
Before you begin, ensure you have the following installed:

- Node.js (version 18 or later)
- npm or Yarn (for managing packages)
- A supported database (for Prisma)

### Installation
**Clone the repository:**
```bash
git clone https://github.com/your-username/wolfbyte.git
cd wolfbyte
```
**Install dependencies:**
```bash
npm install
# or
yarn
```
**Configure environment file:**
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

OPENAI_KEY=
REPLICATE_API_TOKEN=

DATABASE_URL=

STRIPE_API_KEY=
NEXT_PUBLIC_URL=#your_localhost
WEBSITE_CRISP_ID=


```

### Configure Prisma
Have MySQL Database (PlanetScale)
```bash
npx prisma db push
```

### Start the development server:
```bash
npm run dev
# or
yarn dev
```

## References
I would like to extend my gratitude to Antonio Erdeljac for his invaluable project tutorials. His guidance and insights have been instrumental in shaping various aspects of the "Wolfbyte" platform.

## Authors

- [@quyenkhanhnghi](https://www.github.com/quyenkhanhnghi)

