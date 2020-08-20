![logo](/logo.png)

## About us
Inspite of the fact that market is overflowing with a great variety of CRM systems we still may claim uniqueness. Designed specially for IT company, Andersen CRM Sales succesfully automates basic 
business processes which are meant to meet a customer with the company in a most comfortable way. Thus our system let users:</br>
- save customer information and the history of interactions with them,
- analyze sales and activities based on the reports provided in the system,
- keep an eye on the the quality of emplyees work due to the reports suplied,
- broadcast and process qualification requirements for  the specialists being sold,
- manage the process of coordinating innumerable CVs of the specialists,
- manage the process of estimating the projects being offered to customers. <br />

## What our system can do

We have collected key examples of usage. Please, explore the range of Andersen CRM Sales features by getting into [User Guide](https://github.com/Andersen-soft/Sales.CRM/blob/master/User%20Guide%20v%201.0.pdf) <br />
Download the file for more convenient reading.

## Support
If you have something to tell (ask for help, gain extra explanations, propose changes, leave a feedback еtс.), please contact us by e-mail crm.support@andersenlab.com.

## Contributing
Andersen CRM Sales is open for your proposals. The project source code repositories are hosted at GitHub. All proposed changes are submitted and code reviewed using the GitHub Pull Request process.

To submit a pull request:

1. Commit changes and push them to your fork on GitHub. It is a good practice is to create branches instead of pushing to master.
1. In GitHub Web UI click the *New Pull Request button*
1. Select [*Sales.CRM*](https://github.com/Andersen-soft/Sales.CRM) as base fork and *master* as base, then click *Create Pull Request*
1. Fill in the *Pull Request* description.
1. Click *Create Pull Request*
1. Select reviewers: [Front] *spodoprigora*, [Back] *evgotin*
1. Wait for CI results/reviews, process the feedback.

All contributions are considered as [original BSD](./LICENSE.txt) unless it's explicitly stated otherwise.

We require pull request submitters to sign the contributor agreement.. Please downloand the Agreement, complete it and sign, then scan and email a pdf file to crm.legal@andersenlab.com.

ICLA: [Individual Contributor License Agreement](./ICLA.pdf) <br />
CCLA: [Corporate Contributor License Agreement](./CCLA.pdf)

Once your Pull Request has passed the rewiew and it's ready to be merged, it will be included in upcoming release.

## Roadmap
Our project is on the way to perfection. That's why time to time we have updates and releases, as well as improvements and bug fixes. We will keep you in touch by release notes and announcements.

## License
Andersen CRM Sales is licensed under the [original BSD License](./LICENSE.txt)

## Services that require customization 
Some services have default configuration that need to be changed for the application to work properly.
Without this configuration, the application will work but not all functionality will be available.
[Configuration example.](/Backend/.env.example)

1. Amazon cloud configuration(or just use ['local'](/Backend/src/main/resources/application.yml#L8) storage type): [amazon environment variables](/Backend/.env.example#L6)
2. Skype and telegram configuration for the notifications : [messaging environment variables](/Backend/.env.example#L45)
3. Email notification: [email environment variables](/Backend/.env.example#L87)
4. JWT security configuration: [JWT environment variables](/Backend/.env.example#L79)

It is also possible to create sales outside the system through a special user - 'site'.
To use this user, you need to generate a JWT token for him for authentication using an access token value from security configuration.

## Quick start
1. Сlone the repository:</br> 

    "git clone https://github.com/Andersen-soft/Sales.CRM.git"
    or
    "git clone git@github.com:Andersen-soft/Sales.CRM.git"


2. Create and configure the variable files

    Backend: ./Backend/.env
     example configuration ./Backend/example.env
    
    Frontend: ./Frontend/.env
     example configuration ./Frontend/example.env
     
     There is no additional action required if using default settings.


3. Launch: docker-compose up -d

    After installation, change the value of the variable: 
    ./Backend/src/main/application.yml 
    resourcestring.datasource.initialize: "true" to "false"

4. Check in your browser:

    frontend {IP of container launch}:8088
    
    backend {IP of container launch}:8090
    
    db {IP of container launch}:3306


5. Project deletion: 

    docker-compose down --rmi all <br />
 
**By default, the system has preset users for each role**

|      Login        |      Email                 |    Password      |
|:------------------|:---------------------------|:----------------:|
|admin              |admin@test.com              | administrator    |
|sales              |sales@test.com              | administrator    |
|sales_head         |sales_head@test.com         | administrator    |
|rm                 |rm@test.com                 | administrator    |
|hr                 |hr@test.com                 | administrator    |                
|manager            |manager@test.com            | administrator    |
|sales_assistant    |sales_assistant@test.com    | administrator    |
|network_coordinator|network_coordinator@test.com| administrator    |
|site               |site@test.com               | administrator    |

**Login matches the role in the system**<br />

**User data can be changed in the file: Backend/src/main/resources/data.sql**
