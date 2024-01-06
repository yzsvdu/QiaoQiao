package com.vnnsnnt.qiaoqiao.services;

import com.vnnsnnt.qiaoqiao.models.DictionaryEntry;
import org.springframework.stereotype.Service;

import java.io.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DictonaryService {

    private final DictionaryParserService parserService;
    private final Map<String, DictionaryEntry> chineseToEnglishMap;

    public DictonaryService(DictionaryParserService parserService) {
        this.parserService = parserService;
        this.chineseToEnglishMap = loadCedictEntries();
    }

    public Map<String, DictionaryEntry> getChineseToEnglishMap() {
        return chineseToEnglishMap;
    }

    public Map<String, DictionaryEntry> loadCedictEntries() {
        String filePath =  "./src/main/java/com/vnnsnnt/qiaoqiao/services/Creative-Commons-Chinese-English-Dictionary.u8";
        File cedictFile = new File(filePath);
        List<DictionaryEntry> entries = parserService.parseCedictFile(cedictFile);
        Map<String, DictionaryEntry> map = new HashMap<>();
        for (DictionaryEntry entry : entries) {
            String key = entry.getSimplified();
            DictionaryEntry existingEntry = map.get(key);

            if (existingEntry == null) {
                // If the entry does not exist in the map, add it
                map.put(entry.getSimplified(), entry);
                map.put(entry.getTraditional(), entry);
            } else {
                // If the entry already exists, concatenate pinyin and definitions
//                existingEntry.setPinyin(existingEntry.getPinyin());
                existingEntry.setDefinitions(existingEntry.getDefinitions() + " " + entry.getDefinitions());
            }

        }

        for (String key : map.keySet()) {
            DictionaryEntry entry = map.get(key);
            String input = entry.getSimplified();
            if(input == null) continue;
            List<String> substrings = new ArrayList<>();
            for (int len = 1; len < input.length(); len++) {
                for (int i = 0; i <= input.length() - len; i++) {
                    int j = i + len;
                    String substring = input.substring(i, j);
                    substrings.add(substring);
                }
            }

            List<DictionaryEntry> decomposedList = new ArrayList<>();
            for (String subkey : substrings) {
                DictionaryEntry decomposedEntry = map.get(subkey);
                if (decomposedEntry != null) {
                    decomposedList.add(decomposedEntry);
                }
            }
            entry.setDecomposition(decomposedList);
        }
        return map;
    }

}
