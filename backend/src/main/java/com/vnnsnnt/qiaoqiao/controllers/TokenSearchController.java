package com.vnnsnnt.qiaoqiao.controllers;

import com.vnnsnnt.qiaoqiao.models.*;
import com.vnnsnnt.qiaoqiao.models.dtos.DefineRequest;
import com.vnnsnnt.qiaoqiao.services.DictonaryService;
import com.vnnsnnt.qiaoqiao.services.TableService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class TokenSearchController {

    private final DictonaryService dictonaryService;
    private final TableService tableService;

    public TokenSearchController(DictonaryService dictonaryService, TableService tableService) {
        this.dictonaryService = dictonaryService;
        this.tableService = tableService;
    }

    @PostMapping("/define")
    public ResponseEntity<DictionaryEntry> getDefinition(@RequestBody DefineRequest defineRequest) {
        String query = defineRequest.getQuery().replaceAll("[^\\p{Script=Han}]", "");
        List<DictionaryEntry> dictionaryEntries = new ArrayList<>();

        DictionaryEntry dictionaryServiceEntry = dictonaryService.getChineseToEnglishMap().get(query);
        if(dictionaryServiceEntry != null) {
            dictionaryEntries.add(dictionaryServiceEntry);
        }
        for(Table table : tableService.getTables()) {
            DictionaryEntry entry = table.getDictionary().get(query);
            if(entry != null) {
                dictionaryEntries.add(entry);
            }
        }

        // Make temporary dictionary Entry based on Available data
        if(dictionaryEntries.size() == 0) {
            DictionaryEntry dictionaryEntry = new DictionaryEntry();

            StringBuilder fullSimplifiedString = new StringBuilder();
            StringBuilder fullTraditionalString = new StringBuilder();
            List<DictionaryEntry> decomposition = new ArrayList<>();

            for(int i = 0; i < query.length(); i++) {
                char chineseChar = query.charAt(i);
                String chineseCharAsString = String.valueOf(chineseChar);
                DictionaryEntry entry = dictonaryService.getChineseToEnglishMap().get(chineseCharAsString);
                fullSimplifiedString.append(entry.getSimplified());
                fullTraditionalString.append(entry.getTraditional());
                decomposition.add(entry);
            }
            dictionaryEntry.setSimplified(fullSimplifiedString.toString());
            dictionaryEntry.setTraditional(fullTraditionalString.toString());
            dictionaryEntry.setDecomposition(decomposition);
            dictionaryEntry.setDefinitions("Definition Not Found. Check Word Decomposition or Example Sentences for more information.");
            dictionaryEntry.setPinyin("");

            return ResponseEntity.ok(dictionaryEntry);

        } else {
            DictionaryEntry dictionaryEntry = new DictionaryEntry();
            Set<String> pinyins = new HashSet<>();
            Set<String> definitions = new HashSet<>();
            for(DictionaryEntry entry : dictionaryEntries) {
                for(String ps : entry.getPinyin().replaceAll("\\[|\\]", "").split("/")) {
                    pinyins.add(ps.trim());
                }
                for(String ds : entry.getDefinitions().replaceAll("\"", "").split("[/,;]")) {
                    definitions.add(ds.trim());
                }
            }
            String concatenatedPinyin = String.join(" / ", pinyins);
            String concatenatedDefinitions = String.join("; ", definitions);

            dictionaryEntry.setSimplified(dictionaryEntries.get(0).getSimplified());
            dictionaryEntry.setTraditional(dictionaryEntries.get(0).getTraditional());
            dictionaryEntry.setDecomposition(dictionaryEntries.get(0).getDecomposition());
            dictionaryEntry.setPinyin(concatenatedPinyin);
            dictionaryEntry.setDefinitions(concatenatedDefinitions);
            return ResponseEntity.ok(dictionaryEntry);
        }
    }

    @GetMapping("/related")
    public ResponseEntity<RelatedEntries> getRelatedEntries(@RequestParam String query) {
        RelatedEntries relatedEntries = new RelatedEntries();
        String leadingCharacter = query.substring(0, 1);
        String trailingCharacter = query.substring(query.length() - 1);
        List<DictionaryEntry> leadingCharacterEntries = new ArrayList<>();
        List<DictionaryEntry> trailingCharacterEntries = new ArrayList<>();

        // Get all entries for the leading character
        for (Map.Entry<String, DictionaryEntry> entry : dictonaryService.getChineseToEnglishMap().entrySet()) {
            String key = entry.getKey();
            if (key.substring(0, 1).equals(leadingCharacter)) {
                leadingCharacterEntries.add(entry.getValue());
            }
        }

        // Get all entries for the trailing character
        for (Map.Entry<String, DictionaryEntry> entry : dictonaryService.getChineseToEnglishMap().entrySet()) {
            String key = entry.getKey();
            if (key.substring(0, 1).equals(trailingCharacter)) {
                trailingCharacterEntries.add(entry.getValue());
            }
        }

        // Limit to 4 entries for each list and randomize if more
        Collections.shuffle(leadingCharacterEntries);
        Collections.shuffle(trailingCharacterEntries);

        int leadingEntriesCount = Math.min(4, leadingCharacterEntries.size());
        int trailingEntriesCount = Math.min(4, trailingCharacterEntries.size());

        relatedEntries.setLeadingEntryList(leadingCharacterEntries.subList(0, leadingEntriesCount));
        relatedEntries.setTrailingEntryList(trailingCharacterEntries.subList(0, trailingEntriesCount));

        return ResponseEntity.ok(relatedEntries);
    }

    @PostMapping("/suggest")
    public ResponseEntity<SuggestedEntries> getSuggestions(@RequestBody DefineRequest defineRequest) {
        String query = defineRequest.getQuery().replaceAll("[^\\p{Script=Han}]", "");

        SuggestedEntries suggestedEntries = new SuggestedEntries();

        List<String> suggestions = dictonaryService.getChineseToEnglishMap().keySet().stream()
                .filter(dictionaryEntry -> dictionaryEntry.startsWith(query))
                .sorted(Comparator.comparingInt(String::length))
                .limit(10)
                .collect(Collectors.toList());

        for (int i = 0; i < tableService.getTables().size() && suggestions.size() < 10; i++) {
            HashMap<String, DictionaryEntry> map = tableService.getTables().get(i).getDictionary();
            for (String key : map.keySet()) {
                if (key.startsWith(query)) {
                    suggestions.add(key);
                }
            }
        }
        suggestedEntries.setSuggestions(suggestions);
        return ResponseEntity.ok(suggestedEntries);
    }
}

