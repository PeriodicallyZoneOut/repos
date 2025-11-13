package com.example.myapplication;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;
import androidx.recyclerview.widget.RecyclerView;
import java.util.ArrayList;

public class StudentAdapter extends RecyclerView.Adapter<StudentAdapter.ViewHolder> {
    private ArrayList<Student> students;
    private OnItemClickListener listener;
    private int selectedIndex = -1;

    public interface OnItemClickListener {
        void onItemClick(int position);
    }

    public StudentAdapter(ArrayList<Student> students, OnItemClickListener listener) {
        this.students = students;
        this.listener = listener;
    }

    public static class ViewHolder extends RecyclerView.ViewHolder {
        ImageView img;
        TextView tvId;

        public ViewHolder(View itemView) {
            super(itemView);
            img = itemView.findViewById(R.id.imgStudent);
            tvId = itemView.findViewById(R.id.tvStudentId);
        }
    }

    @Override
    public ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View v = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_student, parent, false);
        return new ViewHolder(v);
    }

    @Override
    public void onBindViewHolder(ViewHolder holder, int position) {
        Student s = students.get(position);
        holder.img.setImageResource(s.imageRes);
        holder.tvId.setText(s.id);
        holder.itemView.setSelected(position == selectedIndex);

        holder.itemView.setOnClickListener(v -> {
            int pos = holder.getAdapterPosition();
            if (pos != RecyclerView.NO_POSITION) {
                selectedIndex = pos;
                listener.onItemClick(pos);
                notifyDataSetChanged();
            }
        });
    }

    @Override
    public int getItemCount() {
        return students.size();
    }

    public void setSelectedIndex(int index) {
        selectedIndex = index;
        notifyDataSetChanged();
    }
}
