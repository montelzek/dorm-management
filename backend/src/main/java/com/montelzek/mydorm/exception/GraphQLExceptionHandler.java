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
    protected GraphQLError resolveToSingleError(Throwable ex,@NonNull DataFetchingEnvironment env) {
        switch (ex) {
            case BusinessException businessEx -> {
                Map<String, Object> extensions = ErrorResponseBuilder.buildGraphQLExtensionsFromBusinessException(businessEx);

                return GraphqlErrorBuilder.newError()
                        .message(businessEx.getMessage())
                        .extensions(extensions)
                        .build();
            }
            case IllegalArgumentException illegalArgumentException -> {
                Map<String, Object> extensions = ErrorResponseBuilder.buildGraphQLErrorExtensions(
                        ErrorCodes.VALIDATION_ERROR.getCode(),
                        null
                );

                return GraphqlErrorBuilder.newError()
                        .message(ex.getMessage())
                        .extensions(extensions)
                        .build();
            }
            case IllegalStateException illegalStateException -> {
                Map<String, Object> extensions = ErrorResponseBuilder.buildGraphQLErrorExtensions(
                        ErrorCodes.RESOURCE_CONFLICT.getCode(),
                        null
                );

                return GraphqlErrorBuilder.newError()
                        .message(ex.getMessage())
                        .extensions(extensions)
                        .build();
            }
            default -> {
            }
        }

        return null;
    }
}
