package web.model;

public class ParseNum {
    public static String parse(String s) {
        return s.replace(',', '.').trim();
    }
}
