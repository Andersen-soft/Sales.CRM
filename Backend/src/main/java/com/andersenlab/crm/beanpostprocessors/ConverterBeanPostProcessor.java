package com.andersenlab.crm.beanpostprocessors;

import com.andersenlab.crm.convertservice.Converter;
import com.andersenlab.crm.convertservice.ConverterRegistry;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.config.BeanPostProcessor;
import org.springframework.stereotype.Component;

/**
 * Registers all found converters, during initialization of application context.
 * Converters must be annotated as @Component, if not, converter won't be registered.
 *
 * @see ConverterRegistry
 */
@Component
@AllArgsConstructor
public class ConverterBeanPostProcessor implements BeanPostProcessor {
    /**
     * Converter registry, contains registered converters.
     *
     * @see ConverterRegistry
     */
    private final ConverterRegistry converterRegistry;

    @Override
    public Object postProcessBeforeInitialization(Object bean, String s) {
        if (bean instanceof Converter) {
            converterRegistry.register((Converter) bean);
        }

        return bean;
    }

    @Override
    public Object postProcessAfterInitialization(Object bean, String s) {
        return bean;
    }
}
