package com.vnnsnnt.qiaoqiao.models;

import java.util.List;

public class DictionaryEntry {
    private String traditional;
    private String simplified;
    private String pinyin;
    private String definitions;

    private int id;

    private List<DictionaryEntry> decomposition;

    public String getTraditional() {
        return traditional;
    }

    public void setTraditional(String traditional) {
        this.traditional = traditional;
    }

    public String getSimplified() {
        return simplified;
    }

    public void setSimplified(String simplified) {
        this.simplified = simplified;
    }

    public String getPinyin() {
        return pinyin;
    }

    public void setPinyin(String pinyin) {
        this.pinyin = pinyin;
    }

    public String getDefinitions() {
        return definitions;
    }

    public void setDefinitions(String definitions) {
        this.definitions = definitions;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public List<DictionaryEntry> getDecomposition() {
        return decomposition;
    }

    public void setDecomposition(List<DictionaryEntry> decomposition) {
        this.decomposition = decomposition;
    }
}
