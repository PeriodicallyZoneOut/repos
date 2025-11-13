package com.example.myapplication;

import android.os.Bundle;
import androidx.fragment.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import java.util.ArrayList;

public class FragmentDetail extends Fragment {

    private ArrayList<Student> students;
    private MainActivity activity;
    private int currentIndex = 0;

    public FragmentDetail(ArrayList<Student> students, MainActivity activity) {
        this.students = students;
        this.activity = activity;
    }

    TextView tvId, tvName, tvClass, tvGpa;
    ImageView img;
    Button btnF, btnP, btnN, btnL;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View v = inflater.inflate(R.layout.fragment_detail, container, false);

        tvId = v.findViewById(R.id.tvId);
        tvName = v.findViewById(R.id.tvName);
        tvClass = v.findViewById(R.id.tvClass);
        tvGpa = v.findViewById(R.id.tvGpa);
        img = v.findViewById(R.id.imgStudent);
        btnF = v.findViewById(R.id.btnF);
        btnP = v.findViewById(R.id.btnP);
        btnN = v.findViewById(R.id.btnN);
        btnL = v.findViewById(R.id.btnL);

        updateStudent(0);

        btnF.setOnClickListener(v1 -> activity.navigateTo(0));
        btnP.setOnClickListener(v1 -> {
            if (currentIndex > 0) activity.navigateTo(currentIndex - 1);
        });
        btnN.setOnClickListener(v1 -> {
            if (currentIndex < students.size() - 1) activity.navigateTo(currentIndex + 1);
        });
        btnL.setOnClickListener(v1 -> activity.navigateTo(students.size() - 1));

        return v;
    }

    public void updateStudent(int index) {
        currentIndex = index;
        Student s = students.get(index);
        tvId.setText("Mã: " + s.id);
        tvName.setText("Họ tên: " + s.name);
        tvClass.setText("Lớp: " + s.className);
        tvGpa.setText("Điểm TB: " + s.gpa);
        img.setImageResource(s.imageRes);
        btnF.setEnabled(index != 0);
        btnP.setEnabled(index != 0);
        btnN.setEnabled(index != students.size() - 1);
        btnL.setEnabled(index != students.size() - 1);
    }
}
