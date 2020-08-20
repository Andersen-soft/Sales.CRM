FROM maven:3.6-jdk-8 as builder
COPY . /home/app/
RUN mvn -f /home/app/pom.xml clean install

FROM openjdk:8-jre-alpine3.9
WORKDIR /opt/back
COPY --from=builder /home/app/target/crm_j-1.0-SNAPSHOT.jar /opt/back/crm_back.jar
CMD ["java", "-jar", "crm_back.jar"]

EXPOSE 8080
