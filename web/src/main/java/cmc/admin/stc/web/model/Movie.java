package cmc.admin.stc.web.model;

import cmc.admin.stc.web.enums.MovieStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Created by Mtime on 2016/7/5.
 */
@Getter
@Setter
public class Movie {

    private Integer id;                     // 电影ID
    private String nameCN;                  // 电影中文名
    private List<String> nameAlias;         // 电影别名
    private String shortComment;        // 电影简评
    private Integer duration;           // 时长(单位：分钟)
    private String year;               // 年代
    private LocalDate releaseDate;      // 公映日期
    private LocalDateTime showtime;     // 放映时间
    private MovieStatus status;             // 电影状态

}
