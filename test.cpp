#include <iostream>
#include <random>
using namespace std;

int main(){
    srand(time(NULL));
    cout<<"Hello world!"<<endl;
    cout<<"This is a test file for git - secondBranch"<<endl;
    cout<<"Random number: "<<rand()%100<<endl;
    cout<<"How does it get conflicted?"<<endl;
    return 0;
}