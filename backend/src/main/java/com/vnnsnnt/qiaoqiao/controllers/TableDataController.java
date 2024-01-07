package com.vnnsnnt.qiaoqiao.controllers;
import com.vnnsnnt.qiaoqiao.models.DictionaryEntry;
import com.vnnsnnt.qiaoqiao.models.Table;
import com.vnnsnnt.qiaoqiao.models.TablePreviews;
import com.vnnsnnt.qiaoqiao.services.TableService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

import static com.google.common.primitives.Ints.min;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class TableDataController {
    private final TableService tableService;

    public TableDataController(TableService tableService) {
        this.tableService = tableService;
    }

    @GetMapping("table/{tableName}")
    public ResponseEntity<Table> getTable(
            @RequestParam int startIndex, @RequestParam int endIndex,
            @PathVariable String tableName)
    {
        List<Table> tables = tableService.getTables();
        for (int i = 0; i < tables.size(); i++) {
            if (tables.get(i).getName().trim().equalsIgnoreCase(tableName.replace("-", " "))) {
                return getTableData(i, startIndex, endIndex);
            }
        }
        return ResponseEntity.notFound().build();
    }

    private ResponseEntity<Table> getTableData(
            int tableIndex, int startIndex, int endIndex
    ) {
        Table table = new Table();
        Table dataTable = tableService.getTables().get(tableIndex);

        List<DictionaryEntry> entries = new ArrayList<>();
        List<DictionaryEntry> tableEntries = dataTable.getEntries();

        for (int i = startIndex; i < min(endIndex, dataTable.getEntries().size()); i++) {
            entries.add(tableEntries.get(i));
        }

        table.setEntries(entries);
        table.setName(dataTable.getName());
        table.setUid(dataTable.getUid());
        table.setSize(dataTable.getEntries().size());

        return ResponseEntity.ok(table);
    }

    @GetMapping("table/table-previews")
    public ResponseEntity<TablePreviews> getCuratedBoards() {
        TablePreviews tablePreviews = new TablePreviews();
        List<Table> leftPreviews = new ArrayList<>();
        List<Table> rightPreviews = new ArrayList<>();

        List<Table> tables = tableService.getTables();
        for(int i = 0; i < tables.size(); i++) {
            Table table = new Table();
            table.setEntries(tables.get(i).getEntries().subList(0, 20));
            table.setName(tables.get(i).getName());
            table.setUid(tables.get(i).getUid());
            if(i % 2 == 0) {
                leftPreviews.add(table);
            } else {
                rightPreviews.add(table);
            }
        }

        tablePreviews.setLeftPreviews(leftPreviews);
        tablePreviews.setRightPreviews(rightPreviews);
        return ResponseEntity.ok(tablePreviews);
    }

}
