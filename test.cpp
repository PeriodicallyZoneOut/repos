#include <iostream>
#include <random>
using namespace std;

int main(){
    srand(time(NULL));
    cout<<"Hello world!"<<endl<<rand()%1000 + 1<<endl<<rand()%1000 + 1<<endl;
    return 0;
}