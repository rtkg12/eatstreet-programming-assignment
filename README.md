# eatstreet-programming-assignment
Eatstreet's Programming assignment for the technical interview

Introduction
The objective of this assignment is to gauge the candidate’s ability to work with databases, APIs and ability to work with source code management tools like Git/Github.

The assignment will be divided into multiple steps. During the technical interview we will ask you to build on top of the steps you have accomplished before. We want to see the progress you have made on the assignment so we would want you to frequently push your code to your own GitHub repository.

There are 2 options for the assignment. You are free to choose either option.

Option 1

You are free to use any programming language and database engine to complete the assignment.  You are free to use any JS/CSS framework if you prefer not to write your own. 
This assignment bundle includes an XML and CSV file that contains information about the various zip codes in the US. This option might require you to run your our web server and you might have to bring your computer with you to the technical interview for a demonstration

Step 1
Build a user interface where it can accept only XML or CSV file (choose which format you will allow) which will be in the same format/structure as the one provided to you. Your code should parse the contents of the file and update the database with the changes from the new file. Zip code will never change but associated data might so use that as the key for updates. If there is a new zip code entry it would have to be added to the database.

Step 2
Build a user interface which allow searches using inputs for zip code, city and state. Preferably use drop down for the list of states. Search should return exact matches of locations using zip and city and state. If one of them is empty do not use that field as a search parameter.

Step 3
Build a user interface that will have 3 inputs. 2 for zip codes and 1 for distance. You’ll use these inputs to query the API here http://www.zipcodeapi.com/API#matchClose and display the location details if there are matching results. For example: If you use 53703 and 53703 as the zip codes and 10 miles as the distance you’ll display all the information about both zip codes. Try the same with 53703 and 65221 and 10 miles and you’ll not display any information since they are not close to each other.


For the technical interview you’ll demo this project and we might ask you to make edits or build new features. Come prepared with your own ideas on how you can extend this project.
