package com.example.myapplication;

import androidx.appcompat.app.AppCompatActivity;
import android.os.Bundle;
import java.util.ArrayList;

public class MainActivity extends AppCompatActivity implements FragmentList.OnStudentSelectedListener {

    ArrayList<Student> students = new ArrayList<>();
    FragmentDetail fragmentDetail;
    FragmentList fragmentList;
    int currentIndex = 0;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        students.add(new Student("SV01", "Nguyen Van A", "12A1", 8.5, R.drawable.user1));
        students.add(new Student("SV02", "Tran Thi B", "12A2", 7.8, R.drawable.user2));
        students.add(new Student("SV03", "Le Van C", "12A3", 9.0, R.drawable.user3));
        students.add(new Student("SV04", "Trinh Van D", "12A1", 8.5, R.drawable.user4));
        students.add(new Student("SV05", "Ngo Van E", "12A1", 8.0, R.drawable.user5));
        students.add(new Student("SV06", "Vo Van F", "12A1", 10.0, R.drawable.user6));
        students.add(new Student("SV07", "Tran Van G", "12A1", 9.75, R.drawable.user7));
        students.add(new Student("SV08", "Tong Van H", "12A1", 8.5, R.drawable.user8));
        students.add(new Student("SV09", "Dao Van I", "12A1", 9.0, R.drawable.user9));
        students.add(new Student("SV10", "Pham Van K", "12A1", 8.5, R.drawable.user10));

        fragmentList = new FragmentList(students, this);
        fragmentDetail = new FragmentDetail(students, this);

        getSupportFragmentManager().beginTransaction()
                .replace(R.id.frameList, fragmentList)
                .replace(R.id.frameDetail, fragmentDetail)
                .commit();

    }

    @Override
    public void onStudentSelected(int index) {
        currentIndex = index;
        fragmentDetail.updateStudent(index);
    }

    public void navigateTo(int index) {
        currentIndex = index;
        fragmentList.highlightStudent(index);
        fragmentDetail.updateStudent(index);
    }
}
