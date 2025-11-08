package web.model;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class HitResult implements Serializable {
    private final double x, y, r;
    private final boolean hit;
    private final long execNs;
    private final String time;

    public HitResult(double x, double y, double r, boolean hit, long execNs) {
        this.x = x; this.y = y; this.r = r; this.hit = hit; this.execNs = execNs;
        this.time = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
    }
    public double getX() { return x; }
    public double getY() { return y; }
    public double getR() { return r; }
    public boolean isHit() { return hit; }
    public long getExecNs() { return execNs; }
    public String getTime() { return time; }
}
