package com.montelzek.mydorm.exception;

import graphql.GraphQLError;
import graphql.GraphqlErrorBuilder;
import graphql.schema.DataFetchingEnvironment;
import org.springframework.context.MessageSource;
import org.springframework.graphql.execution.DataFetcherExceptionResolverAdapter;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.servlet.LocaleResolver;
import reactor.util.annotation.NonNull;

import java.util.Locale;

@Component
public class GraphQLExceptionHandler extends DataFetcherExceptionResolverAdapter {

    private final MessageSource messageSource;
    private final LocaleResolver localeResolver;

    public GraphQLExceptionHandler(MessageSource messageSource, LocaleResolver localeResolver) {
        this.messageSource = messageSource;
        this.localeResolver = localeResolver;
    }

    @Override
    protected GraphQLError resolveToSingleError(Throwable ex, @NonNull DataFetchingEnvironment env) {
        Locale locale = getLocaleFromRequest();
        String message;
        
        if (ex instanceof BusinessException businessEx) {
            message = messageSource.getMessage(
                businessEx.getErrorCode(),
                null,
                businessEx.getMessage(),
                locale
            );
        } else if (ex instanceof IllegalArgumentException || ex instanceof IllegalStateException) {
            message = messageSource.getMessage(
                "VALIDATION_ERROR",
                null,
                ex.getMessage(),
                locale
            );
        } else {
            message = messageSource.getMessage(
                "INTERNAL_ERROR",
                null,
                "An unexpected error occurred",
                locale
            );
        }

        return GraphqlErrorBuilder.newError()
                .message(message)
                .build();
    }

    private Locale getLocaleFromRequest() {
        try {
            ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attributes != null) {
                return localeResolver.resolveLocale(attributes.getRequest());
            }
        } catch (Exception e) {
            // Fallback to default locale
        }
        return new Locale("pl");
    }
}
