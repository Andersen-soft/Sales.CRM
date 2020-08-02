package com.andersenlab.crm.configuration;

import com.andersenlab.crm.exceptions.CrmAuthException;
import com.andersenlab.crm.security.AuthHandler;
import com.andersenlab.crm.security.TokenManager;
import io.jsonwebtoken.JwtException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.ChannelInterceptorAdapter;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.core.Authentication;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.config.annotation.AbstractWebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.server.HandshakeInterceptor;

import javax.servlet.http.HttpSession;
import java.util.LinkedList;
import java.util.Map;

import static com.andersenlab.crm.security.SecurityConstants.ACCESS_HEADER;

/**
 * WebSocketConfig.
 *
 * @author Roman_Haida
 * 26.07.2019
 */
@Slf4j
@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
public class WebSocketConfig extends AbstractWebSocketMessageBrokerConfigurer {

    @Value("${app.cors.origins}")
    private String corsOrigins;

    private final AuthHandler authHandler;
    private final TokenManager tokenManager;

    @Bean
    public HandshakeInterceptor handshakeInterceptor() {
        return new HandshakeInterceptor() {

            @Override
            public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response,
                                           WebSocketHandler wsHandler, Map<String, Object> attributes) throws Exception {
                if (request instanceof ServletServerHttpRequest) {
                    ServletServerHttpRequest servletRequest = (ServletServerHttpRequest) request;
                    HttpSession session = servletRequest.getServletRequest().getSession();
                    attributes.put("sessionId", session.getId());
                }
                return true;
            }

            @Override
            public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler,
                                       Exception exception) {
                log.warn("Handshake was failed.");
            }
        };
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/crm")
                .setAllowedOrigins("*")
                .withSockJS()
                .setInterceptors(handshakeInterceptor());

        registry.addEndpoint("/crm")
                .setAllowedOrigins("*");
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.setApplicationDestinationPrefixes("/app");
        registry.enableSimpleBroker("/topic", "/queue");
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(jwtAuthorizationChannelInterceptor());
    }

    @Bean
    public ChannelInterceptor jwtAuthorizationChannelInterceptor() {
        return new ChannelInterceptorAdapter() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                StompHeaderAccessor accessor =
                        MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
                if (accessor != null && StompCommand.CONNECT.equals(accessor.getCommand())) {
                    try {
                        String token = (String)
                                ((LinkedList)
                                        ((LinkedMultiValueMap)
                                                accessor.getHeader("nativeHeaders"))
                                                .get(ACCESS_HEADER))
                                        .getFirst();
                        String login = tokenManager.getLogin(token);
                        Authentication user = authHandler.getWSPrincipal(login);
                        accessor.setUser(user);
                    } catch (JwtException e) {
                        log.error("Error parsing token: [{}]", e);
                        throw new CrmAuthException(e.getMessage());
                    }
                }
                return message;
            }
        };
    }
}
