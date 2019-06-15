import static spark.Spark.*;

public class Application {
    public static void main(String[] args) {
        port(Config.port);

        path("/api", () -> {
            path("/words", WordAPI::paths);
        });

        // enable cors: https://gist.github.com/saeidzebardast/e375b7d17be3e0f4dddf
        options("/*",
                (request, response) -> {

                    String accessControlRequestHeaders = request
                            .headers("Access-Control-Request-Headers");
                    if (accessControlRequestHeaders != null) {
                        response.header("Access-Control-Allow-Headers",
                                accessControlRequestHeaders);
                    }

                    String accessControlRequestMethod = request
                            .headers("Access-Control-Request-Method");
                    if (accessControlRequestMethod != null) {
                        response.header("Access-Control-Allow-Methods",
                                accessControlRequestMethod);
                    }

                    return "OK";
                });

        before((request, response) -> response.header("Access-Control-Allow-Origin", "*"));
    }
}
