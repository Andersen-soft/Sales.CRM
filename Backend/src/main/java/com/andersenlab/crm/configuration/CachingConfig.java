package com.andersenlab.crm.configuration;

import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import com.google.common.cache.LoadingCache;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.CachingConfigurerSupport;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.concurrent.ConcurrentMapCache;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.TimeUnit;

@Configuration
@EnableCaching
public class CachingConfig extends CachingConfigurerSupport {

    @Override
    public CacheManager cacheManager() {
        return new ConcurrentMapCacheManager() {

            @Override
            protected Cache createConcurrentMapCache(String name) {
                return new ConcurrentMapCache(name,
                        CacheBuilder.newBuilder()
                                .expireAfterWrite(15, TimeUnit.MINUTES)
                                .build()
                                .asMap(), false);
            }
        };
    }

    @Bean(name = "refreshTokenCache")
    public LoadingCache tokenCache(){
        return CacheBuilder.newBuilder()
                .maximumSize(500)
                .expireAfterWrite(1, TimeUnit.MINUTES)
                .build(
                        new CacheLoader<String, String>() {
                            public String load(String key) {
                                return key;
                            }
                        }
                );
    }
}
