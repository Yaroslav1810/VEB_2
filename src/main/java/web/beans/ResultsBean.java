package web.beans;

import jakarta.enterprise.context.SessionScoped;
import jakarta.inject.Named;
import web.model.HitResult;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Named("resultsBean")
@SessionScoped
public class ResultsBean implements Serializable {
    private final List<HitResult> data = new ArrayList<>();
    public List<HitResult> getData() { return Collections.unmodifiableList(data); }
    public void add(HitResult r) { data.add(0, r); }
    public void clear() { data.clear(); }
    public HitResult getLast() {
        var data = getData();
        return data.isEmpty() ? null : data.get(data.size() - 1);
    }
}
