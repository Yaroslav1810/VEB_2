package web.model;

public class IsHit {
    public static boolean hit(double x, double y, double r) {
        double X = (7.0 * x) / r;
        double Y = (6.0 * y) / r;
        return (Y <= yTop(X)) && (Y >= yBottom(X));

    }

    private static double yTop(double x) {
        double a = Math.abs(x);
        if (a < 0.5) {
            return 2.25;
        } else if (a < 0.75) {
            return 3 * a + 0.75;
        } else if (a < 1) {
            return 9 - 8 * a;
        } else if (a < 3) {
            return 1.5 - 0.5 * a - (3 * Math.sqrt(10) / 7) * (Math.sqrt(3 - a * a + 2 * a) - 2);
        } else {
            return 3 * Math.sqrt(1 - Math.pow((a / 7), 2));
        }
    }

    private static double yBottom(double x) {
        double a = Math.abs(x);
        if (a < 4) {
            return a / 2 - ((3 * Math.sqrt(33) - 7) / 112) * a * a + Math.sqrt(1 - Math.pow(Math.abs(a - 2) - 1, 2)) - 3;
        } else {
            return -3 * Math.sqrt(-Math.pow((a / 7), 2) + 1);
        }
    }
}
