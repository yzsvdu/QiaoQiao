package com.vnnsnnt.qiaoqiao.services;

import com.vnnsnnt.qiaoqiao.models.DictionaryEntry;
import com.vnnsnnt.qiaoqiao.models.Table;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;

@Service
public class TableService {
    private final List<Table> tables;
    private final String table_paths = "./src/main/java/com/vnnsnnt/qiaoqiao/services/table_paths.txt";

    public TableService() {
        this.tables = loadAllTablesInPath();
    }

    public List<Table> getTables() {
        return tables;
    }

    public List<Table> loadAllTablesInPath() {
        List<Table> tables = new ArrayList<>();

        try {
            // Get all table links from table path text file
            Path path = Paths.get(table_paths);
            List<String> tablePaths = Files.readAllLines(path);

            //loop through all table paths
            for (String tablePath : tablePaths) {

                File file = new File(tablePath);

                List<DictionaryEntry> entries = new ArrayList<>();
                HashMap<String, DictionaryEntry> dictionary = new HashMap<>();
                Table table = new Table();

                //Read each line of a table
                BufferedReader br = new BufferedReader(new FileReader(file));
                String line;
                boolean firstLine = true;
                while ((line = br.readLine()) != null) {
                    if(firstLine) {
                        firstLine = false;
                        table.setName(line);
                        table.setUid(TableIdentifierGenerator.generateTableIdentifier(line));
                        continue;
                    }

                    String[] parts = line.split(",", 5);
                    DictionaryEntry entry = createDictionaryEntry(parts);
                    entries.add(entry);
                    dictionary.put(entry.getSimplified(), entry);
                }

                table.setEntries(entries);
                table.setDictionary(dictionary);
                tables.add(table);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return tables;
    }

    private DictionaryEntry createDictionaryEntry(String[] parts) {
        DictionaryEntry entry = new DictionaryEntry();
        entry.setId(Integer.parseInt(parts[0]));
        entry.setSimplified(parts[1]);
        entry.setTraditional(parts[2]);
        entry.setPinyin(parts[3]);
        entry.setDefinitions(parts[4]);
        return entry;
    }

}
