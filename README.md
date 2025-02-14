# Game Tournament Platform  

**Description**  
A web application for creating and playing interactive tournament-style games. Users can register, create custom games with multiple choices, wchich can be played by different users to determine the ultimate winner. The platform also includes features like user authentication, game commenting, and dynamic win-rate calculations.  

---

## Core Features  
- **User Authentication**: Register, log in, and manage sessions using Firebase Authentication.  
- **Game Creation**: Create custom games with titles, categories, descriptions, and multiple choices (including images).  
- **Interactive Gameplay**: Play games with head-to-head matchups and progress through rounds to determine a winner.  
- **Commenting System**: Add and view comments on games.  
- **Dynamic Win Rates**: Automatic calculation of win rates and championship rates based on user interactions.  
- **Category Browsing**: Browse games by category or keywords, with paginated results.  

---

## Used Technologies  
- **Python** (Backend)
- **Django** (Backend framework)  
- **Firebase** (Authentication and Realtime Database)   
- **REST Framework** (API development)  
- **HTML/CSS/TypeScript** (Frontend)  

---

## Operation Overview  
1. **User Authentication**:  
   - Register, log in, and manage sessions using Firebase.    

2. **Game Creation**:  
   - Authenticated users can create games by providing details like title, category, description, and choices with images.  

3. **Gameplay**:  
   - Start a game and make choices in head-to-head matchups.  
   - Progress through rounds until a winner is determined.  

4. **Comments**:  
   - Add comments to games, which are displayed under different games. 

5. **Win Rates**:  
   - Dynamic calculation and updating of win rates and championship rates based on playthroughs of other users.   
