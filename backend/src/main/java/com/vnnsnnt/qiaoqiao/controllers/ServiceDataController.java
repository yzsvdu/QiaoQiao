package com.vnnsnnt.qiaoqiao.controllers;

import com.vnnsnnt.qiaoqiao.models.Table;
import com.vnnsnnt.qiaoqiao.services.TableService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class ServiceDataController {
    private final TableService tableService;

    public ServiceDataController(TableService tableService) {
        this.tableService = tableService;
    }

    public class TableIDPackage {
        private List<String> uids;
        private List<String> names;

        public List<String> getNames() {
            return names;
        }

        public void setNames(List<String> names) {
            this.names = names;
        }

        public void setUids(List<String> uids) {
            this.uids = uids;
        }

        public List<String> getUids() {
            return uids;
        }
    }
    @GetMapping("service/all-tables")
    public ResponseEntity<TableIDPackage> getTableIDS() {
        TableIDPackage tableIDPackage = new TableIDPackage();
        List<String> uids = new ArrayList<>();
        List<String> names = new ArrayList<>();
        List<Table> tables = this.tableService.getTables();

        for(Table t : tables) {
            uids.add(t.getUid());
            names.add(t.getName().replaceAll(" ", "-"));
        }

        tableIDPackage.setUids(uids);
        tableIDPackage.setNames(names);
        return ResponseEntity.ok(tableIDPackage);
    }

}
