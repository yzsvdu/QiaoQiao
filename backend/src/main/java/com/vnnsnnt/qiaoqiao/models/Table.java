package com.vnnsnnt.qiaoqiao.models;

import java.util.HashMap;
import java.util.List;

public class Table {
    private String name;
    private String uid;
    private HashMap<String, DictionaryEntry> dictionary;
    private List<DictionaryEntry> entries;
    private Integer size;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUid() {
        return uid;
    }

    public void setUid(String uid) {
        this.uid = uid;
    }

    public HashMap<String, DictionaryEntry> getDictionary() {
        return dictionary;
    }

    public void setDictionary(HashMap<String, DictionaryEntry> dictionary) {
        this.dictionary = dictionary;
    }

    public List<DictionaryEntry> getEntries() {
        return entries;
    }

    public void setEntries(List<DictionaryEntry> entries) {
        this.entries = entries;
    }

    public Integer getSize() {
        return size;
    }

    public void setSize(Integer size) {
        this.size = size;
    }
}
