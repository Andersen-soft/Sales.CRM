package com.andersenlab.crm.configuration;

import static org.springframework.messaging.simp.SimpMessageType.CONNECT;
import static org.springframework.messaging.simp.SimpMessageType.DISCONNECT;
import static org.springframework.messaging.simp.SimpMessageType.UNSUBSCRIBE;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.messaging.MessageSecurityMetadataSourceRegistry;
import org.springframework.security.config.annotation.web.socket.AbstractSecurityWebSocketMessageBrokerConfigurer;

/**
 * WebSocketSecurityConfig.
 *
 * @author Roman_Haida
 * 30.07.2019
 */
@Configuration
public class WebSocketSecurityConfig extends AbstractSecurityWebSocketMessageBrokerConfigurer {
    @Override
    protected void configureInbound(MessageSecurityMetadataSourceRegistry messages) {
        messages
                .simpSubscribeDestMatchers("/topic/**", "/queue/**").authenticated()
                .simpDestMatchers("/app/**").authenticated()
                .simpTypeMatchers(CONNECT, UNSUBSCRIBE, DISCONNECT).permitAll()
                .anyMessage().denyAll();
    }

    @Override
    protected boolean sameOriginDisabled() {
        // While CSRF is disabled..
        return true;
    }
}
