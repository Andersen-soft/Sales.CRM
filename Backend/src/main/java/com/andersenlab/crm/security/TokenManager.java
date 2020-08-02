package com.andersenlab.crm.security;

import static com.andersenlab.crm.security.SecurityConstants.TOKEN_PREFIX;

import com.andersenlab.crm.configuration.properties.TokenProperties;
import com.andersenlab.crm.model.entities.Token;
import com.andersenlab.crm.model.entities.VerificationKey;
import com.andersenlab.crm.services.TokenService;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;

import java.nio.ByteBuffer;
import java.nio.CharBuffer;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Date;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@RequiredArgsConstructor
public class TokenManager {

    private final TokenService tokenService;
    private final TokenProperties tokenProperties;

    /**
     * Creates a specific token whose key to be added to verifying URL that will be sent to the user by email.
     *
     * @param login inner user login in crm system
     * @return token key
     */
    public String createTokenKey(String login) {
        String token = generateToken(login, tokenProperties.getAccessSecret(), tokenProperties.getRegisterExpirationTimeMillis());
        String tokenKey = UUID.randomUUID().toString();
        tokenService.saveVerificationKey(new VerificationKey().setTokenKey(tokenKey).setToken(token));
        return tokenKey;
    }

    TokenPair createTokenPair(String login) {
        String refreshToken = generateToken(login, tokenProperties.getRefreshSecret(), tokenProperties.getRefreshExpirationTimeMillis());
        String accessToken = generateToken(login, tokenProperties.getAccessSecret(), tokenProperties.getAccessExpirationTimeMillis());
        tokenService.save(new Token(login, refreshToken));
        return new TokenPair(refreshToken, accessToken);
    }

    TokenPair refreshTokenPair(String refreshToken) {
        String login = parseLogin(refreshToken, tokenProperties.getRefreshSecret());
        String newRefresh = generateToken(login, tokenProperties.getRefreshSecret(), tokenProperties.getRefreshExpirationTimeMillis());
        String newAccess = generateToken(login, tokenProperties.getAccessSecret(), tokenProperties.getAccessExpirationTimeMillis());
        tokenService.update(refreshToken, new Token(login, newRefresh));
        return new TokenPair(newRefresh, newAccess);
    }

    private Token findToken(String refreshToken) {
        return Optional.ofNullable(tokenService.findTokenByValue(refreshToken))
                .orElseThrow(() -> new AccessDeniedException("Invalid token"));
    }

    private String parseLogin(String token, char[] secret) {
        return Jwts.parser()
                .setSigningKey(toBytes(secret))
                .parseClaimsJws(token.replace(TOKEN_PREFIX, ""))
                .getBody()
                .getSubject();
    }

    public String getLogin(String accessToken) {
        return parseLogin(accessToken, tokenProperties.getAccessSecret());
    }

    private String generateToken(String login, char[] secret, long expiration) {
        return TOKEN_PREFIX + Jwts.builder()
                .setSubject(login)
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(SignatureAlgorithm.HS512, toBytes(secret))
                .compact();
    }

    void invalidateToken(String token) {
        Token found = findToken(token);
        tokenService.delete(found);
    }

    private static byte[] toBytes(char[] chars) {
        CharBuffer charBuffer = CharBuffer.wrap(chars);
        ByteBuffer byteBuffer = StandardCharsets.UTF_8.encode(charBuffer);
        byte[] bytes = Arrays.copyOfRange(byteBuffer.array(),
                byteBuffer.position(), byteBuffer.limit());
        Arrays.fill(byteBuffer.array(), (byte) 0); // clear sensitive data
        return bytes;
    }
}
