package com.montelzek.mydorm.exception;

import graphql.GraphQLError;
import graphql.GraphqlErrorBuilder;
import graphql.schema.DataFetchingEnvironment;
import org.springframework.graphql.execution.DataFetcherExceptionResolverAdapter;
import org.springframework.stereotype.Component;
import reactor.util.annotation.NonNull;

import java.util.Map;

@Component
public class GraphQLExceptionHandler extends DataFetcherExceptionResolverAdapter {

    @Override
    protected GraphQLError resolveToSingleError(Throwable ex, @NonNull DataFetchingEnvironment env) {
        String message;
        
        if (ex instanceof BusinessException businessEx) {
            message = businessEx.getMessage();
        } else if (ex instanceof IllegalArgumentException || ex instanceof IllegalStateException) {
            message = ex.getMessage();
        } else {
            message = "An unexpected error occurred";
        }

        return GraphqlErrorBuilder.newError()
                .message(message)
                .build();
    }
}
