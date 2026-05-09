# ⚔️ GitHub RPG Summoner

Turn any GitHub profile into a legendary, interactive RPG character card. 

This React-based web application fetches real-time data from the GitHub REST API and runs it through a custom "Stat Mapping" algorithm to generate a personalized fantasy character. Complete with 3D parallax effects, a customized medieval UI, and dynamic data visualization.

![GitHub RPG Demo](https://via.placeholder.com/800x400?text=Replace+this+with+a+GIF+of+your+card+flipping)

## ✨ Features

* **Real-Time Data Integration:** Connects to the GitHub API to pull user profiles, follower counts, account age, and up to 100 recent repositories.
* **Algorithmic Stat Generation:** Converts boring metrics into RPG stats. Your repos become "Mana," your followers become "HP," and your account age unlocks "Special Moves."
* **Language Mastery Radar:** Uses `recharts` to map out a user's top 5 programming languages on the back of the card.
* **Interactive 3D Physics:** Powered by `react-parallax-tilt` to give the card a physical, tactile feel with holographic CSS gradients.
* **"Export Scroll" Functionality:** Utilizes `html2canvas` to let users download their generated character card as a high-quality PNG for social media sharing.
* **Custom Vibe UI:** Built from scratch with CSS variables, SVGs, and trigonometric particle animations (no pre-made component libraries here).

## 🧮 How the "Magic" Works (The Logic)

To make the cards feel balanced and realistic, the app uses a deterministic algorithm to assign stats:

* **Level (Lvl):** Calculated using a logarithmic scale combining Repositories, Followers, Stars, Forks, and Account Age. Capped at Level 99.
* **Class System:** Assigned based on contribution patterns.
  * *Code Artisan:* > 20 Repos
  * *Master Architect:* > 50 Repos
  * *Guild Leader:* > 500 Followers
  * *Legendary Sorcerer:* > 100 Repos & > 1000 Followers
* **Weaponry:** Automatically equipped based on the user's most frequently used programming language (e.g., JavaScript = "Void Scripts", Python = "Serpent Staff").

## 🛠️ Tech Stack

* **Frontend Framework:** React 18 (via Vite)
* **Styling:** Custom Vanilla CSS (Flexbox/Grid, CSS Variables, Keyframe Animations)
* **Data Visualization:** Recharts
* **Physics/Interaction:** React Parallax Tilt
* **Asset Generation:** html2canvas
* **Icons:** Lucide React

## 🚀 Local Setup

Want to summon characters locally? Follow these steps:

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/YOUR_USERNAME/github-rpg.git](https://github.com/YOUR_USERNAME/github-rpg.git)
   cd github-rpg
Install the dependencies:

Bash
npm install
Start the development server:

Bash
npm run dev
Open your browser:
Navigate to http://localhost:5173 and start summoning!

Note on API Limits: This app uses unauthenticated requests to the GitHub API, which limits you to 60 requests per hour. If you get a "Hero not found" error after heavy use, you may have hit the rate limit.

🗺️ Roadmap / Future Quests
[ ] Add Personal Access Token (PAT) support for higher API rate limits.

[ ] Implement a "Party System" to compare two GitHub users side-by-side.

[ ] Add recent commit history to the back of the card ("Recent Quests").

🧙‍♂️ Author
Built by LunaeQuinx.

If you like this project, consider giving it a ⭐ on GitHub and sharing your generated card on LinkedIn!
www.linkedin.com/in/syfqhmdni
