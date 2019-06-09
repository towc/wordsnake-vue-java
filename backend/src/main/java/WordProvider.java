import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.util.*;
import java.util.stream.Collectors;

public class WordProvider {
    private static List<String> allWords;
    private static Map<Integer, List<String>> wordsByLength;
    private static Map<Character, List<String>> wordsByInitial;
    // initial -> length -> word
    private static Map<Character, Map<Integer, List<String>>> dict;

    public static void loadWords() {
        allWords = new ArrayList<>();
        wordsByLength = new HashMap<>();
        wordsByInitial = new HashMap<>();
        dict = new HashMap<>();

        try {
            File file = new File(Config.dictionaryLocation);
            BufferedReader br = new BufferedReader(new FileReader(file));

            String word;
            while ((word = br.readLine()) != null) {
                if (word.contains("'"))
                    continue;

                word = word.toUpperCase();
                int length = word.length();
                char initial = word.charAt(0);

                if (!wordsByLength.containsKey(length)) {
                    wordsByLength.put(length, new ArrayList<>());
                }

                if (!wordsByInitial.containsKey(initial)) {
                    wordsByInitial.put(initial, new ArrayList<>());
                    dict.put(initial, new HashMap<>());
                }

                if (!dict.get(initial).containsKey(length)) {
                    dict.get(initial).put(length, new ArrayList<>());
                }

                allWords.add(word);
                wordsByLength.get(length).add(word);
                wordsByInitial.get(initial).add(word);
                dict.get(initial).get(length).add(word);
            }
        } catch (Exception e) {
            System.out.println("failed loading words, here's the error:\n" + e.getMessage());
            System.exit(1);
        }

    }

    private static String getWord(int length) {
        if (!wordsByLength.containsKey(length)) {
            return null;
        }
        return getRandom(wordsByLength.get(length));
    }
    private static String getWord(int length, char start) {
        if (!dict.containsKey(start) || !dict.get(start).containsKey(length)) {
            return null;
        }

        return getRandom(dict.get(start).get(length));
    }
    private static String getWord(int minSize, int maxSize, char start) {
        if (!dict.containsKey(start)) {
            return null;
        }

        Set<Integer> availableSizes = dict.get(start).keySet();
        Set<Integer> usableSizes = availableSizes.stream()
                .filter(size -> size <= maxSize && size >= minSize)
                .collect(Collectors.toSet());

        if (usableSizes.size() == 0) {
            return null;
        }

        List<List<String>> usableWords = new ArrayList<>();
        for(int size : usableSizes) {
            usableWords.add(dict.get(start).get(size));
        }

        return getRandomInContainer(usableWords);
    }
    private static String getWord(int minSize, int maxSize) {
        Set<Integer> usableSizes = wordsByLength.keySet()
                .stream()
                .filter(size -> size <= maxSize && size >= minSize)
                .collect(Collectors.toSet());

        if (usableSizes.size() == 0) {
            return null;
        }

        List<List<String>> usableWords = new ArrayList<>();
        for(int size : usableSizes) {
            usableWords.add(wordsByLength.get(size));
        }

        return getRandomInContainer(usableWords);
    }

    // avoids moving memory around, which is a huge runtime performance increase
    private static String getRandomInContainer(List<List<String>> wordContainer) {
        List<Integer> cumulativeCounts = new ArrayList<>();
        cumulativeCounts.add(0);
        int sum = 0;
        for(List<String> words : wordContainer) {
            sum += words.size();
            cumulativeCounts.add(sum);
        }

        int chosen = (int) Math.floor(Math.random() * sum);
        for(int i = 1; i < cumulativeCounts.size(); i += 1) {
            if (chosen < cumulativeCounts.get(i)) {
                return wordContainer.get(i - 1)
                        .get(chosen - cumulativeCounts.get(i - 1));
            }
        }

        // if there are enough words, it doesn't get here
        return null;
    }

    private static String getRandom(List<String> words) {
        return words.get((int) Math.floor(Math.random() * words.size()));
    }

    private static String getRandom(Set<String> words) {
        return getRandom(new ArrayList<>(words));
    }

    public static List<String> fromCountAndRange(int count, int minSize, int maxSize) {
        List<String> words = new LinkedList<>();

        if (count == 0)
            return words;

        String lastWord = getWord(minSize, maxSize);
        words.add(lastWord);

        for(int i = 1; i < count; i += 1) {
            lastWord = getWord(minSize, maxSize, lastWord.charAt(lastWord.length() - 1));
            words.add(lastWord);
        }

        return words;
    }

    public static List<String> fromLengths(List<Integer> lengths) {
        List<String> words = new LinkedList<>();

        if (lengths.size() == 0)
            return words;

        String lastWord = getWord(lengths.get(0));
        words.add(lastWord);
        if (lastWord == null)
            return null;

        for(int i = 1; i < lengths.size(); i += 1) {
            lastWord = getWord(lengths.get(i), lastWord.charAt(lastWord.length() - 1));
            if (lastWord == null)
                return null;
            words.add(lastWord);
        }

        return words;
    }
}