# ChallengeQ-BackEnd

Challenge-Quest is a Hackathon Challenge and Communication platform for communities to engage with each other and solve real-world problems. CQ allows organizations to sign up and create new challenges in order to engage with their members and local ecosystem. Members can sign up and create or join teams which will allow them to participate in developing new solutions for outstanding issues. CQ provides many different categories of challenges and levels of difficulty in order to reach problem-solvers of all kinds.

[ChallengeQ-BackEnd](https://github.com/Technopathic/ChallengeQ-BackEnd)

[DEMO](http://challenges.innovationmesh.com)

## Screenshot

![Screenshot](http://h4z.it/Image/ad6938_challengesSS.PNG)

## Requirements
* PHP 7.x
* Laravel 5.4
* MySQL
* ReactJS 16.x
* Node 7.9.x
* Composer 1.5.x

## Getting Started

In order to use ChallengeQ to create your own Challenge aggregation website, you will clone both this Repo BackEnd and the FrontEnd. Starting with the BackEnd, you'll need to install the necessary libraries, edit the .env file, and migrate the database tables.

```
cd ChallengeQ-BackEnd
composer install
(Be sure to set your database information in .env.example and rename the file to .env)
php artisan key:generate
php artisan migrate
php artisan serve
```

As for the FrontEnd, you will also do the same in regards to installing the node packages and running your server.

```
cd ChallengeQ-FrontEnd
npm install
npm run start
```

On the FrontEnd you may have to update the API routes to correspond with the BackEnd API. Aside from that you should be able to navigate to http://localhost:3000/ and begin developing.

## License
GNU/GPL 3.0
