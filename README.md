# AdminBlog

AdminBlog is an open-source dynamic website solution without a traditional database, built with Next.js, Tailwind CSS, and Shadcn/UI. It leverages GitHub as a content management system, providing a seamless way to create and manage website content.

## Deploy on Vercel

1. **Push your code to GitHub.**
2. **Log in to [Vercel](https://vercel.com/) and create a new project from your GitHub repository.**
3. **Configure the following environment variables in Vercel:**
   - `GITHUB_TOKEN` — your GitHub personal access token (with repo access)
   - `GITHUB_OWNER` — your GitHub username
   - `GITHUB_REPO` — your repository name
   - `ACCESS_PASSWORD` — your secure admin password
   - `JWT_SECRET` — a strong random string for JWT signing (e.g. use [1Password password generator](https://1password.com/password-generator/))
   - `NEXT_PUBLIC_SITE_URL` — your Vercel deployment URL (e.g. `https://your-app.vercel.app`)
4. **Deploy the project.**

## Features

- **Database-free Architecture**: Utilizes GitHub for content storage and management.
- **Dynamic Content**: Renders content dynamically using Next.js server-side rendering.
- **Markdown Support**: Write your content in Markdown format for easy editing and version control.
- **Admin Interface**: Built-in admin panel for content and resource management.
- **JWT Authentication**: Secure admin login with JWT tokens, logout, and session expiration handling.
- **Resource Management**: Manage `data/json/resources.json` directly from the admin panel.
- **Accessibility**: Keyboard navigation, skip links, ARIA labels, and semantic HTML.
- **Responsive Design**: Fully responsive design using Tailwind CSS.
- **SEO Friendly**: Optimized for search engines with dynamic metadata and per-post meta tags.
- **Easy Deployment**: Simple deployment process to Vercel.

## Prerequisites

- Node.js (version 14 or later)
- npm (comes with Node.js)
- Git
- GitHub account
- Vercel account (for deployment)

## Tech Stack

- Next.js
- React
- Tailwind CSS
- Shadcn/UI
- GitHub as CMS
- JWT (jsonwebtoken)

## Project Setup

1. Install dependencies:
   ```
   npm install
   ```
2. Run the development server:
   ```
   npm run dev
   ```
3. Visit `http://localhost:3000` to view the app.

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/bingbing1263/adminblog.git
   cd adminblog
   ```

2. Create a `.env.local` file in the root directory and add the following:
   ```
   GITHUB_TOKEN=your_github_personal_access_token
   GITHUB_OWNER=your_github_username
   GITHUB_REPO=your_repo_name
   ACCESS_PASSWORD=your_secure_access_password
   JWT_SECRET=your_random_jwt_secret
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

3. Set up your GitHub repository:
   - Create a new repository on GitHub
   - Create two folders in the repository: `data/json` and `data/md`
   - In `data/json`, create a file named `resources.json` with an empty array: `[]`

## Usage

- Access the admin panel by navigating to `/admin` and logging in with your `ACCESS_PASSWORD`.
- Create, edit, and delete articles through the admin interface.
- Manage resources in the admin panel (`data/json/resources.json`).
- All changes are automatically synced with your GitHub repository.
- Admin session is protected by JWT authentication and can be logged out at any time.

## Accessibility & SEO

- Skip-to-content link, ARIA labels, semantic HTML, and keyboard navigation.
- Dynamic meta tags for SEO on all blog posts.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

AdminBlog is open-source software licensed under the [MIT license].

## Support

If you encounter any issues or have questions, please file an issue on the GitHub repository.

## Acknowledgements

AdminBlog is built with the following open-source libraries:
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn/UI](https://ui.shadcn.com/)
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)
