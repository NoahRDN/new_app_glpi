package edu.itu.newappglpi.model;

public class KanbanSetting {
    private String columnKey;
    private String labelMg;
    private String backgroundColor;
    private Integer displayOrder;

    public String getColumnKey() {
        return columnKey;
    }

    public void setColumnKey(String columnKey) {
        this.columnKey = columnKey;
    }

    public String getLabelMg() {
        return labelMg;
    }

    public void setLabelMg(String labelMg) {
        this.labelMg = labelMg;
    }

    public String getBackgroundColor() {
        return backgroundColor;
    }

    public void setBackgroundColor(String backgroundColor) {
        this.backgroundColor = backgroundColor;
    }

    public Integer getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }
}
