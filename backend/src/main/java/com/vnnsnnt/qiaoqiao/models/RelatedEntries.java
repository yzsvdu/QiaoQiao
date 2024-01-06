package com.vnnsnnt.qiaoqiao.models;

import java.util.ArrayList;
import java.util.List;

public class RelatedEntries {
    private List<DictionaryEntry> leadingEntryList = new ArrayList<>();
    private List<DictionaryEntry> trailingEntryList = new ArrayList<>();

    public List<DictionaryEntry> getLeadingEntryList() {
        return leadingEntryList;
    }

    public void setLeadingEntryList(List<DictionaryEntry> leadingEntryList) {
        this.leadingEntryList = leadingEntryList;
    }

    public List<DictionaryEntry> getTrailingEntryList() {
        return trailingEntryList;
    }

    public void setTrailingEntryList(List<DictionaryEntry> trailingEntryList) {
        this.trailingEntryList = trailingEntryList;
    }
}
