import spark.Request;
import spark.Response;

import java.util.Arrays;
import java.util.Collection;
import java.util.LinkedList;
import java.util.List;

import static spark.Spark.*;

public class WordAPI {
    private static char[] noiseChars = { '-', ':', '~', '.', '#', '!', '+', '(', ')' };

    public static void paths() {
        WordProvider.loadWords();

        get("/", WordAPI::sendGeneralWords);
        get("/count/:count", WordAPI::sendGeneralWords);
        get("/count/:count/range/:min/:max", WordAPI::sendGeneralWords);
        get("/range/:min/:max", WordAPI::sendGeneralWords);

        get("/by-length/:lengths", WordAPI::sendSpecificLengthWords);

        // couldn't get `after` to work, so I'm wrapping every result in `finalize`
    }

    private static String sendGeneralWords(Request req, Response res) {
        ParamUtil params = new ParamUtil(req);
        int count = params.toIntegerOrDefault(":count", Config.defaultCount);
        int minSize = params.toIntegerOrDefault(":min", Config.defaultMinSize);
        int maxSize = params.toIntegerOrDefault(":max", Config.defaultMaxSize);

        return finalize(WordProvider.fromCountAndRange(count, minSize, maxSize));
    }

    private static String sendSpecificLengthWords(Request req, Response res) {
        ParamUtil params = new ParamUtil(req);
        List<Integer> lengths = params.getIntegers(":lengths");

        return finalize(WordProvider.fromLengths(lengths));
    }

    private static String finalize(List<String> words) {
        return finalize(String.join(",", words));
    }
    private static String finalize(String result) {
        return insertNoise(result);
    }

    private static String insertNoise(String result) {
        LinkedList<String> chars = new LinkedList<>(Arrays.asList(result.split("")));

        // random, but proportional to already present response
        int noiseCharCount = (int) Math.floor(getRandomIndex(chars) * Config.noiseRatio);

        for(int i = 0; i < noiseCharCount; ++i) {
            chars.add(getRandomIndex(chars), String.valueOf(getRandomChar(noiseChars)));
        }

        return String.join("", chars);
    }

    private static char getRandomChar(char[] str) {
        return str[getRandomIndex(str)];
    }
    private static int getRandomIndex(char[] arr) {
        return (int) Math.floor(Math.random() * arr.length);
    }
    private static int getRandomIndex(Collection collection) {
        return (int) Math.floor(Math.random() * collection.size());
    }
    private static int getRandomIndex(String str) {
        return (int) Math.floor(Math.random() * str.length());
    }


}
