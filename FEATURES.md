# Feature List

Feature list for the **Adonis Self Improvement** back-end.

## Authentication

We will allow logging in with Discord, Email and Google. 

## Getting the user data

The user's personal progress and data will be stored on and retrieved from the MongoDB Atlas database.

Stored data: Name, Level/XP, Progress in the tree, Challenges, Badges.

Upon getting the user's profile picture, we will return the picture dependent on their level

## Synchronize

Synchronization between the bot and app. A way to link the discord account to the account on your app.

## Leveling

Handling the levels will be done by adding up the XP on the back-end and using the algorithm.
$50 * (1.02^L)$ (L = current level)

Updated each time the user completes a challenge or skill.


## Completing a challenge/skill

Function that is ran every time the user completes a specific challenge/skill.
Updates the user's current tasks and XP/Level if needed.

## Storing the skill tree

We will store the tree using the [Model Tree Structure with Parent References](https://www.mongodb.com/docs/manual/tutorial/model-tree-structures-with-parent-references/)

## Some panel or easy way to alter the skill tree (only accessible by admins)

The skill tree is not complete, and if we ever want to change it, scowering the database to manually add it will not be ideal. So we will have a panel that will allow admins to add/remove skills.

# Architecture

`[User] ---> [Discord Bot] ---> [API] ---> [Back-end]`

> This is a very, very basic idea, but just as a nice picture for your brain.
