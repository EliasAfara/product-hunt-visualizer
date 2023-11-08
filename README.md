# Product Hunt Visualizer

A web application built with Angular, Node.js, TypeScript, and GraphQL. It fetches and visualizes data from the [Product Hunt API](https://api.producthunt.com/v2/docs).

## Features

- **Data Visualization**: Displays Product Hunt data in an easy-to-understand format.
- **Infinite Scroll**: Automatically fetches and displays new products when the user scrolls to the end of the page.
- **Pie/Donut Chart**: Showcases the topics of the fetched products and their count.

## Deployment

The client side of the application is deployed on [Netlify](https://www.netlify.com/), and the server side is deployed on [Render](https://render.com/).

You can access the live application here: [Product Hunt Visualizer](https://product-hunt-visualizer.netlify.app/)

## Getting Started

1. **Clone the repository**:

   ```bash
   git clone https://github.com/EliasAfara/product-hunt-visualizer.git
   ```

2. **Navigate into the project directory**:

   ```bash
   cd product-hunt-visualizer
   ```

3. **Install the dependencies**:

   ```bash
   npm install
   ```

4. **Start the application**:

   ```bash
   npm run dev
   ```

This will start the client on port 4200 and server on port 4000 concurrently.
