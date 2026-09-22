package com.velocity;
import net.dv8tion.jda.api.JDA;
import net.dv8tion.jda.api.JDABuilder;
import io.github.cdimascio.dotenv.Dotenv;
public class Velocity{
    public static void main(String[] args) {
        Dotenv dotenv = Dotenv.load();
        System.out.println("Velocity is starting");
        String token = dotenv.get("DISCORD_TOKEN");
        JDA jda = JDABuilder
                    .createDefault(token)
                    .build();
    }
}