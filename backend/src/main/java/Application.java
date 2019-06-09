import static spark.Spark.*;

public class Application {
    public static void main(String[] args) {
        port(Config.port);
        path("/api", () -> {
            path("/words", WordAPI::paths);
        });
    }
}
