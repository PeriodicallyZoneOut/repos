package com.example.myapplication;

import android.os.Bundle;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import java.util.ArrayList;

public class FragmentList extends Fragment {

    public interface OnStudentSelectedListener {
        void onStudentSelected(int index);
        void navigateTo(int index);
    }

    private ArrayList<Student> students;
    private OnStudentSelectedListener listener;
    private StudentAdapter adapter;
    private TextView tvSummary;

    public FragmentList(ArrayList<Student> students, OnStudentSelectedListener listener) {
        this.students = students;
        this.listener = listener;
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_list, container, false);

        tvSummary = view.findViewById(R.id.tvSummary);
        RecyclerView recyclerView = view.findViewById(R.id.recyclerView);
        recyclerView.setLayoutManager(new LinearLayoutManager(getContext()));

        adapter = new StudentAdapter(students, position -> {
            listener.onStudentSelected(position);
            updateSummary(position); //
        });
        recyclerView.setAdapter(adapter);

        if (students != null && !students.isEmpty()) {
            adapter.setSelectedIndex(0);
            updateSummary(0);
        }

        return view;
    }

    private void updateSummary(int index) {
        if (tvSummary != null && index >= 0 && index < students.size()) {
            Student s = students.get(index);
            tvSummary.setText("Mã: " + s.id);
        }
    }

    public void highlightStudent(int index) {
        adapter.setSelectedIndex(index);
        updateSummary(index);
    }
}
