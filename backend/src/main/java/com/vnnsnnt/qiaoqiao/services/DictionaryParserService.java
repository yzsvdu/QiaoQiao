package com.vnnsnnt.qiaoqiao.services;

import com.vnnsnnt.qiaoqiao.models.DictionaryEntry;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.*;

@Service
public class DictionaryParserService {

    public List<DictionaryEntry> parseCedictFile(File file) {
        List<DictionaryEntry> entries = new ArrayList<>();
        try (BufferedReader br = new BufferedReader(new FileReader(file))) {
            String line;
            while ((line = br.readLine()) != null) {
                DictionaryEntry entry = parseCedictEntry(line);
                if (entry.getSimplified() != null) {
                    entries.add(entry);
                }
            }
        } catch (IOException e) {
            // Handle exception (e.g., log it)
        }

        return entries;
    }

    private DictionaryEntry parseCedictEntry(String entryLine) {
        DictionaryEntry dictionaryEntry = new DictionaryEntry();
        String[] temp = entryLine.split("/", 2);
        if(temp.length > 1) {
            String definitions = temp[1];
            String[] words = temp[0].split("\\[");
            if(words.length > 1) {
                String pinyin = "[" + words[1];
                String[] characters = words[0].split(" ");
                String traditional = characters[0];
                String simplified = characters[1];
                dictionaryEntry.setTraditional(traditional);
                dictionaryEntry.setSimplified(simplified);
                dictionaryEntry.setPinyin(pinyin);
                dictionaryEntry.setDefinitions(definitions);
            }
        }
        return dictionaryEntry;
    }
}
