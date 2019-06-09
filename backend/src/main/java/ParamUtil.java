import spark.Request;

import java.util.ArrayList;
import java.util.List;

public class ParamUtil {
    private Request req;

    public ParamUtil(Request req) {
        this.req = req;
    }

    public int toIntegerOrDefault(String param, int base) {
        String value = req.params(param);

        if (value == null) {
            return base;
        }

        return Integer.parseInt(value);
    }

    public List<Integer> getIntegers(String param) {
        String[] values = req.params(param).split(",");
        List<Integer> ints = new ArrayList<>();

        for(String value : values) {
            ints.add(Integer.parseInt(value));
        }

        return ints;
    }
}
